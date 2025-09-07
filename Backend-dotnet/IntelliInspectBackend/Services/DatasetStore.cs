using System.Dynamic;

namespace IntelliInspectBackend.Services
{
    public static class DatasetStore
    {
        public static List<Dictionary<string, object>> Records { get; set; } = new();
    }
}
