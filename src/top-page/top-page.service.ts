import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { addDays } from 'date-fns';

@Injectable()
export class TopPageService {
	constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {
	}

	async create(dto: CreateTopPageDto) {
		return this.topPageModel.create(dto);
	}

	async findById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findAll() {
	  return this.topPageModel.find({}).exec();
  }

	async findByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel.find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 }).exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndRemove(id).exec();
	}

	async updateById(id: string, dto: CreateTopPageDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findForHhUpdate(date: Date) {
		return this.topPageModel.find({
			firstCategory: 0,
			$or: [
				{ 'hh.updatedAt': { $lt: addDays(date, -1) } },
				{ 'hh.updatedAt': { $exists: false } },
			],
		}).exec();
	}

}
