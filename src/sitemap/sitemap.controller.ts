import { Controller, Get, Header } from '@nestjs/common';
import { TopPageService } from '../top-page/top-page.service';
import { ConfigService } from '@nestjs/config';
import { addDays, format } from 'date-fns';
import {Builder} from 'xml2js';
import { CATEGORY_URL } from './sitemap.constants';

@Controller('sitemap')
export class SitemapController {
	domain: string;

	constructor(
		private readonly topPageService: TopPageService,
		private readonly configService: ConfigService,
	) {
		this.domain = this.configService.get('DOMAIN') ?? '';
	}

	@Get('xml')
	@Header('content-type', 'text/xml')
	async siteMap() {
		const formatString = 'yyyy-MM-dd\'T\'HH:mm:00.000xxx';
		let res = [{
				loc: `${this.domain}`,
				lastmod: format(addDays(new Date(), 1), formatString),
				changefreq: 'daily',
				priority: '1.0'
			},
			{
				loc: `${this.domain}/courses`,
				lastmod: format(addDays(new Date(), 1), formatString),
				changefreq: 'daily',
				priority: '1.0'
			}
		];

		const pages = await this.topPageService.findAll();
		// @ts-ignore
		res = res.concat(pages.map(page => {
			return {
				// @ts-ignore
				loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
				// @ts-ignore
				lastmod: format(addDays(new Date(page.updatedAt ?? new Date()), 1), formatString),
				changefreq: 'weekly',
				priority: '0.7'
			};
		}));
		const builder = new Builder({
			xmldec: {version: '1.0', encoding: 'UTF-8'}
		});

		return builder.buildObject({
			urlSet: {
				$: {
					xmlns: 'http://www.sitemap.org/schemas/sitemap/0.9'
				},
				url: res
			}
		});

	}
}
