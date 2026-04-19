import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RecipeService } from '../../../core/services';

@Component({
  selector: 'app-new-recipe',
  imports: [FormsModule, RouterLink],
  templateUrl: './new-recipe.html',
  styleUrl: './new-recipe.css',
})
export class NewRecipe implements OnInit {
  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  recipeId: string | null = null;

  formData = {
    name: '',
    category: 'Main Dishes',
    ingredients: '',
    instructions: '',
    imageUrl: '',
  };

  ngOnInit() {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.recipeId;

    if (this.isEditMode && this.recipeId) {
      this.recipeService.getRecipeById(this.recipeId).subscribe({
        next: (recipe) => {
          this.formData = {
            name: recipe.name,
            category: recipe.category,
            ingredients: recipe.ingredients.join('\n'),
            instructions: recipe.instructions.join('\n'),
            imageUrl: recipe.imageUrl,
          };
        },
        error: (err) => console.error('Failed to load recipe', err),
      });
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const recipeData = {
      name: this.formData.name,
      category: this.formData.category,
      ingredients: this.formData.ingredients.split('\n').filter((line) => line.trim()),
      instructions: this.formData.instructions.split('\n').filter((line) => line.trim()),
      imageUrl: this.formData.imageUrl,
    };

    const request = this.isEditMode
      ? this.recipeService.editRecipe(this.recipeId!, recipeData)
      : this.recipeService.createRecipe(recipeData);

    request.subscribe({
      next: (recipe) => this.router.navigate(['/recipes', recipe._id]),
      error: (err) => console.error('Failed to save recipe', err),
    });
  }
}
