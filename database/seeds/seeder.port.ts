import { DataSource } from 'typeorm';

export interface SeederPort {
  name: string;
  dependencies?: string[];
  seed(dataSource: DataSource, context: Record<string, any>): Promise<void>;
}
