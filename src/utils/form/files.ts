import { readFileSync } from "fs";

function extractStringsFromFile(filePath: string) {
  try {
    // Read the content of the file
    const fileContent = readFileSync(filePath, "utf-8");

    // Split the content into an array of strings based on line breaks
    const stringsArray = fileContent.split("\n").filter(Boolean);

    // Log or return the array of strings
    // console.log(stringsArray);
    // If you want to return the array of strings instead of logging, use the following line:
    // return stringsArray;
  } catch (error: any) {
    console.error("Error reading the file:", error?.message);
  }
}

export { extractStringsFromFile };
