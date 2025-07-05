import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DISTRICT_REPOSITORY } from '../../location.di-tokens';
import { DistrictRepositoryPort } from '../../database/ports/district.repository.port';
import { GetDistrictWithProvinceResponseDto } from './dtos/get-district-with-province.response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LocationQueryService {
  constructor(
    @Inject(DISTRICT_REPOSITORY)
    private readonly districtRepo: DistrictRepositoryPort,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getDistrictWithProvinceByDistrictCode(
    districtCode: number,
  ): Promise<GetDistrictWithProvinceResponseDto> {
    const cacheKey = `location:district:${districtCode}`;
    const cached =
      await this.cacheManager.get<GetDistrictWithProvinceResponseDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const result =
      await this.districtRepo.findOneWithProvinceByCode(districtCode);

    if (!result) throw new NotFoundException('District or Province not found');

    await this.cacheManager.set(cacheKey, result, 60 * 60 * 24);

    return result;
  }
}
