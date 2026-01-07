import {ProgressionEntityProps} from '../../entity/progression.entity';

export type RushProgressionReadState = {
  id: string;
  name: string;
  progressions: ProgressionEntityProps[];
  open: boolean;
};
