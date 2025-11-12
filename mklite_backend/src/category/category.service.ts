import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../entity/category.entity';
import { CreateHistogramOptions } from 'perf_hooks';

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Categoria)
        private readonly categoryRepository : Repository<Categoria>,
    ) { }

    async createCategory(category: Categoria) : Promise<Categoria> {
        const newCategory = this.categoryRepository.create(category);
        return await this.categoryRepository.save(newCategory);
    }

    async getAllCategories() : Promise<Categoria[]>{
        return await this.categoryRepository.find();
    }

    
}