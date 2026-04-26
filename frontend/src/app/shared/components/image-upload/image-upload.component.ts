import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../../core/services/file-upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  
})
export class ImageUploadComponent {
  @Input() maxFiles = 5;
  @Output() imagesUploaded = new EventEmitter<string[]>();
  
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  uploading = false;
  errorMessage = '';

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      // Vérifier le nombre total de fichiers
      if (this.selectedFiles.length + files.length > this.maxFiles) {
        this.errorMessage = `Vous ne pouvez télécharger que ${this.maxFiles} images maximum`;
        return;
      }

      // Vérifier chaque fichier
      for (const file of files) {
        // Vérifier le type
        if (!file.type.startsWith('image/')) {
          this.errorMessage = 'Seules les images sont acceptées';
          return;
        }

        // Vérifier la taille (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'La taille de l\'image ne doit pas dépasser 5MB';
          return;
        }

        // Ajouter le fichier
        this.selectedFiles.push(file);

        // Créer une preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrls.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      this.errorMessage = '';
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  uploadImages(): void {
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Veuillez sélectionner au moins une image';
      return;
    }

    this.uploading = true;
    this.errorMessage = '';

    this.fileUploadService.uploadImages(this.selectedFiles).subscribe({
      next: (response) => {
        console.log('Upload success:', response);
        this.imagesUploaded.emit(response.urls);
        this.uploading = false;
        this.showSuccessToast('Images téléchargées avec succès !');
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.errorMessage = error.error?.message || 'Erreur lors du téléchargement';
        this.uploading = false;
        this.showErrorToast(this.errorMessage);
      }
    });
  }

  private showSuccessToast(message: string): void {
    this.showToast(message, 'success');
  }

  private showErrorToast(message: string): void {
    this.showToast(message, 'error');
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all transform ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-100');
    }, 10);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}