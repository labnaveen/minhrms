export default interface IEnvelope {
    subject: string;
    text?: string;
    cc?: string[] | string,
    html?: string;
    attachments?: any;
  }
  