import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products
}

export class HhData {
  @prop()
  count: number;

  @prop()
  juniorSalary: number;

  @prop()
  middleSalary: number;

  @prop()
  seniorSalary: number;
}

export interface TopPageModel extends Base {}
export class TopPageModel extends TimeStamps{
  @prop({enum: TopLevelCategory})
  firstLevelCategory: TopLevelCategory;

  @prop()
  secondLevelCategory: string;

  @prop({unique: true})
  alias: string;

  @prop()
  title: string;

  @prop()
  category: string;


  hh?: HhData

  advantages: {
    title: string;
    description: string;
  }[];

  seoText: string;
  tagsTitle: string;
  tags: string[];
}
