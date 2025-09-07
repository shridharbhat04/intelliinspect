using Microsoft.AspNetCore.Mvc;
using CsvHelper;
using System.Globalization;
using IntelliInspectBackend.Services;


namespace IntelliInspectBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        [HttpPost("dataset")]
        public async Task<IActionResult> UploadDataset(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (!file.FileName.EndsWith(".csv"))
                return BadRequest("Invalid file format. Please upload a CSV.");

            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

            var records = csv.GetRecords<dynamic>().ToList();

            if (!records.Any())
                return BadRequest("CSV file is empty");

            // Ensure 'Response' column exists
            var headers = csv.Context.Reader.HeaderRecord;
            if (headers == null || !headers.Contains("Response"))
                return BadRequest("CSV must contain 'Response' column");

            // Synthetic timestamps
            DateTime startTime = new DateTime(2021, 1, 1, 0, 0, 0);
            var timestamps = Enumerable.Range(0, records.Count)
                .Select(i => startTime.AddSeconds(i))
                .ToList();

            // Calculate metadata
            int rowCount = records.Count;
            int colCount = headers.Length + 1; // +1 for synthetic timestamp
            int passCount = records.Count(r =>
                Convert.ToInt32(((IDictionary<string, object>)r)["Response"]) == 1);

            double passRate = (double)passCount / rowCount * 100.0;

            var metadata = new
            {
                FileName = file.FileName,
                TotalRecords = rowCount,
                TotalColumns = colCount,
                PassRate = $"{passRate:F2}%",
                EarliestTimestamp = timestamps.First(),
                LatestTimestamp = timestamps.Last()
            };
            // Save dataset in memory for later
            DatasetStore.Records = records
                .Select(r => new Dictionary<string, object>(r, StringComparer.OrdinalIgnoreCase))
                .ToList();
            return Ok(metadata);
        }
    }
}