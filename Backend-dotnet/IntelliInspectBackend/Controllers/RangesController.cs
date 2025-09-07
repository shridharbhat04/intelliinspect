using Microsoft.AspNetCore.Mvc;
using IntelliInspectBackend.Services;

namespace IntelliInspectBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RangesController : ControllerBase
    {
        [HttpPost("validate")]
        public IActionResult ValidateRanges([FromBody] RangesRequest request)
        {
            if (request == null)
                return BadRequest("Invalid request");

            // Simple validation rules
            if (request.TrainStart > request.TrainEnd ||
                request.TestStart > request.TestEnd ||
                request.SimStart > request.SimEnd)
                return BadRequest("Start date must be earlier than end date");

            if (request.TrainEnd >= request.TestStart ||
                request.TestEnd >= request.SimStart)
                return BadRequest("Ranges must be non-overlapping and sequential");

            // Fake counts for now (later: actually count rows in dataset)
            var summary = new
            {
                Status = "Valid",
                TrainingRecords = 5000,
                TestingRecords = 2000,
                SimulationRecords = 3000
            };

            return Ok(summary);
        }
    }

    public class RangesRequest
    {
        public DateTime TrainStart { get; set; }
        public DateTime TrainEnd { get; set; }
        public DateTime TestStart { get; set; }
        public DateTime TestEnd { get; set; }
        public DateTime SimStart { get; set; }
        public DateTime SimEnd { get; set; }
    }
}
