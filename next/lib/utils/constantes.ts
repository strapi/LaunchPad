
export const isDevDebug = process.env.NODE_ENV === "development"



export const ACCEPTED_FILES = {
  // Documents
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/rtf": [".rtf"],
  "application/vnd.oasis.opendocument.text": [".odt"],
  "application/x-iwork-pages-sffpages": [".pages"],

  // Images
  "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff"],

  // Feuilles de calcul
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-excel": [".xls"],

  // Présentations
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "application/x-iwork-keynote-sffkey": [".key"],
  "application/vnd.oasis.opendocument.presentation": [".odp"],

  // Archives
  "application/zip": [".zip"],
};

