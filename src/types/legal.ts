export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalPageContent {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  footerCopyright: string;
}
