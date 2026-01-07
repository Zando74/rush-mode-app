import {MailEntityProps} from '../../entity/mail.entity';
import {TradeEntityProps} from '../../entity/trade.entity';

export type RushFraudReadState = {
  id: string;
  name: string;
  mails: MailEntityProps[];
  trades: TradeEntityProps[];
  open: boolean;
};
