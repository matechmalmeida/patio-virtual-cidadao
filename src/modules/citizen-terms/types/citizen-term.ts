export interface CitizenTerm {
  id: string;
  slug: string;
  title: string;
  content: string;
  version: number;
  signed: boolean;
  signedAt: string | null;
  signedBy: { id: string; name: string } | null;
}

export interface CitizenTermsResponse {
  terms: CitizenTerm[];
}

export interface CitizenSignTermResponse {
  termId: string;
  signed: boolean;
  signedAt: string;
}
