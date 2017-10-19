import { IonicErrorHandler } from 'ionic-angular';
import Raven from 'raven-js';

Raven.config(
  'https://29e5863a9ac34030be703cceb8af7d3f@sentry.io/181186'
).install();

export class SentryErrorHandler extends IonicErrorHandler {
  handleError(error) {
    super.handleError(error);

    try {
      Raven.captureException(error.originalError || error);
    } catch (e) {
      console.error(e);
    }
  }
}
