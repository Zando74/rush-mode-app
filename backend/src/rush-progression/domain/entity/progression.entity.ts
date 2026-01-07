import {MissingFieldError} from '../../../shared/domain/error/missing-field.error';

export interface ProgressionEntityProps {
  playerName: string;
  achievements: string[];
}

export class ProgressionEntity {
  playerName: string;
  achievements: string[];

  constructor(props: ProgressionEntityProps) {
    this.isValidProps(props);
    this.playerName = props.playerName;
    this.achievements = props.achievements;
  }

  toSnapshot(): ProgressionEntityProps {
    return {
      playerName: this.playerName,
      achievements: this.achievements,
    };
  }

  private isValidProps(props: ProgressionEntityProps) {
    if (props.playerName === undefined) {
      throw new MissingFieldError('playerName is required');
    }
    if (props.achievements === undefined) {
      throw new MissingFieldError('achievements is required');
    }
  }
}
