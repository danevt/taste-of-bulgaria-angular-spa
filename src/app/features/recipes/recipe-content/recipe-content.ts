import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService, AuthService } from '../../../core/services';
import { Recipe } from '../../../models';
import { DatePipe } from '@angular/common';
import { CommentBoard } from '../../comments/comment-board/comment-board';

@Component({
  selector: 'app-recipe-content',
  standalone: true,
  imports: [RouterLink, DatePipe, CommentBoard],
  templateUrl: './recipe-content.html',
  styleUrl: './recipe-content.css',
})
export class RecipeContent implements OnInit {
  private recipeService = inject(RecipeService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  recipe: Recipe | null = null;
  isOwner = false;
  isLoggedIn = this.authService.isLoggedIn;
  isFavorited = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        const currentUserId = this.authService.getCurrentUserId();
        this.isOwner =
          typeof recipe.userId === 'object'
            ? recipe.userId._id === currentUserId
            : recipe.userId === currentUserId;
        this.isFavorited = recipe.favorites.includes(currentUserId || '');
      },
      error: (err) => console.error('Failed to load recipe', err),
    });
  }

  deleteRecipe() {
    if (!this.recipe || !confirm('Are you sure you want to delete this recipe?')) return;

    this.recipeService.deleteRecipe(this.recipe._id).subscribe({
      next: () => this.router.navigate(['/recipes']),
      error: (err) => console.error('Failed to delete recipe', err),
    });
  }

  toggleFavorite() {
    if (!this.recipe) return;

    this.recipeService.toggleFavorite(this.recipe._id).subscribe({
      next: (updatedRecipe) => {
        this.recipe = updatedRecipe;
        const currentUserId = this.authService.getCurrentUserId();
        this.isFavorited = updatedRecipe.favorites.includes(currentUserId || '');
      },
      error: (err) => console.error('Failed to toggle favorite', err),
    });
  }
}
