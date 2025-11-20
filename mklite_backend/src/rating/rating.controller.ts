import {Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { RatingService } from './rating.service';
import { Calificacion } from 'src/entity/rating.entity';

@Controller('calificaciones')
export class RatingController {
    constructor(private readonly ratingService: RatingService){

    }
}