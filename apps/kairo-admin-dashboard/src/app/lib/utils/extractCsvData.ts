import Papa from "papaparse";

export async function extractCsvData(
  file: File,
  papaParseConfig?: Papa.ParseConfig
): Promise<any[]> {
  if (!file) {
    throw new Error("No file provided");
  }

  if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
    throw new Error("Invalid file type. Please upload a CSV file.");
  }

  const defaultConfig: Papa.ParseConfig = {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    delimiter: ",",
    transform: (value: any): string => {
      return typeof value === "string" ? value.trim() : String(value);
    },
  };

  const results = await new Promise<Papa.ParseResult<any>>(
    (resolve, reject) => {
      Papa.parse(file, {
        ...defaultConfig,
        ...papaParseConfig,
        complete: (results) => {
          if (results.errors.length > 0) {
            const errorMessages = results.errors
              .map((err) => `Row ${err.row}: ${err.message}`)
              .join("; ");
            reject(new Error(`CSV parsing errors: ${errorMessages}`));
          } else {
            resolve(results);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    }
  );

  return results.data;
}

export default extractCsvData;
