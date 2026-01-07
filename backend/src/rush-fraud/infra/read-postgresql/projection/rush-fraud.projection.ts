import {Entity, Column, PrimaryColumn} from 'typeorm';
import {TradeEntityProps} from '../../../domain/entity/trade.entity';
import {MailEntityProps} from '../../../domain/entity/mail.entity';

@Entity('rush_fraud')
export class RushFraudProjection {
  @PrimaryColumn({primaryKeyConstraintName: 'PK_RUSH_FRAUD_ID'})
  id!: string;

  @Column()
  name!: string;

  @Column('jsonb')
  trades!: TradeEntityProps[];

  @Column('jsonb')
  mails!: MailEntityProps[];

  @Column()
  open!: boolean;
}
