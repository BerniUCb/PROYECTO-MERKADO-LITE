// src/backup/backup.controller.ts

import { Controller, Get, Res, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Controller('admin/backups') // La ruta será: http://localhost:3000/admin/backups/download
export class BackupController {

  @Get('download')
  async createAndDownloadBackup(@Res() res: Response) {
    
    // 1. ENCONTRAR LAS RUTAS
    // process.cwd() es la raíz del proyecto backend (mklite_backend)
    const projectRoot = process.cwd();
    
    // El script está en mklite_backend/scripts/backup_merkadolite.sh
    const scriptPath = path.join(projectRoot, 'scripts', 'backup_merkadolite.sh');
    
    // La carpeta de backups está UN NIVEL ARRIBA de backend (PROYECTO-MERKADO-LITE/backups)
    const backupDir = path.join(projectRoot, '..', 'backups');

    console.log(`🚀 Ejecutando script en: ${scriptPath}`);

    // 2. EJECUTAR EL SCRIPT
    exec(`"${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(` Error ejecutando backup: ${error.message}`);
            console.error(stderr);
            return res.status(500).json({ message: 'Error interno generando el backup.' });
        }

        console.log('✅ Backup generado. Buscando archivo...');

        // 3. BUSCAR EL ARCHIVO MS RECIENTE
        try {
            if (!fs.existsSync(backupDir)) {
                throw new Error('La carpeta de backups no existe.');
            }

            // Leemos la carpeta y buscamos el archivo .gz más nuevo
            const files = fs.readdirSync(backupDir)
                            .filter(f => f.endsWith('.sql.gz'))
                            .map(f => ({ name: f, time: fs.statSync(path.join(backupDir, f)).mtime.getTime() }))
                            .sort((a, b) => b.time - a.time); // Ordenar por fecha descendente

            if (files.length > 0) {
                const latestFile = files[0].name;
                const fullPath = path.join(backupDir, latestFile);

                console.log(` Enviando archivo: ${latestFile}`);

                // 4. DESCARGAR
                res.download(fullPath, latestFile, (err) => {
                    if (err) {
                        console.error('Error al enviar archivo:', err);
                    }
                });
            } else {
                res.status(404).json({ message: 'El script corrio, pero no se encontró el archivo .gz generado.' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error leyendo la carpeta de backups.' });
        }
    });
  }
}