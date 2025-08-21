// Central typography configuration
// Change these selections to switch site-wide fonts quickly

export type BodyFontChoice = "inter" | "bodyText";

export const typographyConfig: {
  bodyFont: BodyFontChoice;
  // Display font is used for big decorative headings like the nav title
  displayFont: "rockSalt";
} = {
  // Use the same font as the nav text for body content
  bodyFont: "inter",
  displayFont: "rockSalt",
};


