import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { CreateHistogramOptions } from 'perf_hooks';
import { promises } from 'dns';

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository : Repository<Category>,
    ) { }

    async createCategory(category: Category) : Promise<Category> {
        const newCategory = this.categoryRepository.create(category);
        return await this.categoryRepository.save(newCategory);
    }

    async getAllCategories() : Promise<Category[]>{
        return await this.categoryRepository.find();
    }

    async getCategoryById(id : number): Promise<Category>{
        const category = await this.categoryRepository.findOneBy( { id } );
        if(!category){
            throw new NotFoundException(`Category with ID "${id}" not found`)
        }
        return category;
    }

    async deleteCategory(id : number): Promise<{ deleted: boolean, affected?: number}>{
        
        const result = await this.categoryRepository.delete({id});
        if(result.affected === 0){
            throw new NotFoundException(`Category with ID "${id}" not found`)
        }
        return {deleted: true , affected: result.affected ?? 0}
    }
    
    async updateCategory(id: number, categoryUpdateData: Partial<Category>) : Promise<Category> {
        const existing = await this.categoryRepository.findOne({ where: { id } });

        if (!existing) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        Object.assign(existing, categoryUpdateData);

        return await this.categoryRepository.save(existing);
        }

} 