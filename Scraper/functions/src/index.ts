import { Summarizer } from "./functions/summarizer";
import { ScrapeData } from "./functions/scrapeData";
import { getData } from "./functions/getData";
import { ClaimPage } from "./functions/claimPage";
import { UpdateEmail } from "./functions/updateEmail";
import { AddQueries } from "./functions/addQueries";
import { MailSender } from "./functions/mailSender";
import 'dotenv/config';

export const scraper = ScrapeData;
export const summarizer = Summarizer;
export const retrieve = getData;
export const claim = ClaimPage;
export const update = UpdateEmail;
export const put = AddQueries;
export const notify = MailSender;
