import { HttpException, Injectable } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { Entry } from './entities/entry.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private readonly entryRepository: Repository<Entry>,
  ) {}

async create(createEntryDto: CreateEntryDto) {
  const entryData = this.entryRepository.create({
    ...createEntryDto,
    category: { id: Number(createEntryDto.categoryId) },
  });
  return this.entryRepository.save(entryData);
}


async findAll(categoryId?: string): Promise<Entry[]> {
  if (categoryId) {
    return this.entryRepository.find({
      where: {
        category: { id: Number(categoryId) },
      },
      relations: ['category'],
    });
  }

  return this.entryRepository.find({ relations: ['category'] });
}


  async findOne(id: number): Promise<Entry> {
    const EntryData =
      await this.entryRepository.findOneBy({ id });
    if (!EntryData) {
      throw new HttpException(
        'Entry Not Found',
        404,
      );
    }
    return EntryData;
  }

  async update(
    id: number,
    updateEntryDto: UpdateEntryDto,
  ): Promise<Entry> {
    const existingEntry = await this.findOne(id);
    const EntryData = this.entryRepository.merge(
      existingEntry,
      updateEntryDto,
    );
    return await this.entryRepository.save(
      EntryData,
    );
  }

  async remove(id: number): Promise<Entry> {
    const existingEntry = await this.findOne(id);
    return await this.entryRepository.remove(
      existingEntry,
    );
  }
}

