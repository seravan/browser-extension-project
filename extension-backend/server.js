import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import validator from "validator";
import csurf from "csurf";
import helmet from "helmet";

dotenv.config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.get("/vulnerable-components/", async (req, res) => {
  const url = req.query.url;
  // Validate and sanitize the URL
  if (!validator.isURL(url)) {
    res.status(400).send("Invalid URL");
    return;
  }
  const sanitizedUrl = validator.escape(url);
  // Define an object of known vulnerable libraries and their associated security issues
  const vulnerabilities = [];
  const vulnerableLibraries = {
    jquery: {
      versions: ["1.6.3", "1.9.0", "1.9.1", "2.0.0", "2.0.1", "3.2.1", "3.5.1"],
      issue:
        "Cross-site scripting (XSS) or arbitrary code execution vulnerability",
    },
    angularjs: {
      versions: ["1.0.0-1.1.5", "1.2.0-1.2.25", "1.3.0-1.3.16"],
      issue: "Cross-site scripting (XSS) vulnerability",
    },
    react: {
      versions: [
        "0.14.0-alpha1",
        "0.14.0-alpha2",
        "0.14.0-alpha3",
        "0.14.0-alpha4",
        "0.14.0-alpha5",
        "0.14.0-alpha6",
        "0.14.0-alpha7",
        "0.14.0-beta1",
        "0.14.0-beta2",
        "0.14.0-beta3",
        "0.14.0-rc1",
      ],
      issue: "Cross-site scripting (XSS) vulnerability",
    },
  };
  // Use regular expressions to search for any instances of vulnerable libraries in the HTML content
  const libraryRegexes = {
    jquery: /jquery(?:-\d+\.\d+\.\d+|)-\d+\.\d+\.\d+(?:\.min|)\.js/g,
    angularjs: /angular-(?:\d+\.\d+\.\d+|)\.js/g,
    react: /react(?:-with-addons|-dom|-native|)-\d+\.\d+\.\d+(?:\.min|)\.js/g,
  };
  // const url =
  //   "https://web-highlights.com/blog/how-to-build-a-chrome-extension-using-react/";
  var websiteHtml;
  try {
    const response = await fetch(sanitizedUrl);
    websiteHtml = await response.text();
  } catch (error) {
    res.status().send(404);
  }

  // Loop through each library and check if any vulnerable versions are found in the HTML content
  for (const [libraryName, libraryInfo] of Object.entries(
    vulnerableLibraries
  )) {
    const libraryRegex = libraryRegexes[libraryName];
    const matches = websiteHtml.match(libraryRegex);
    if (matches) {
      for (const match of matches) {
        const versionMatch = match.match(/\d+\.\d+\.\d+/);
        if (versionMatch && libraryInfo.versions.includes(versionMatch[0])) {
          vulnerabilities.push(
            `Potentially vulnerable version of ${libraryName} found (${versionMatch[0]}): ${libraryInfo.issue}`
          );
        }
      }
    }
  }

  // If no vulnerable libraries were found, return null
  res.status(200).json({ body: { ...vulnerabilities } });
});

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(csurf());
// Set the CSRF token in the response headers
app.use((req, res, next) => {
  res.setHeader("X-CSRF-Token", req.csrfToken());
  next();
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
