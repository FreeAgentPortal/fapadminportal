export default interface LegalType {
  _id: string;
  type: string;
  title: string;
  content: string;
  effective_date: Date;
  version: string;
}
