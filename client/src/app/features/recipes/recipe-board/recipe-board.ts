import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Recipe } from '../../../models';
import { RecipeService } from '../../../core/services';
import { SliceTitle, TimeAgo } from '../../../shared/pipes';

@Component({
  selector: 'app-recipe-board',
  imports: [RouterLink, SliceTitle, TimeAgo],
  templateUrl: './recipe-board.html',
  styleUrl: './recipe-board.css',
})
export class RecipeBoard implements OnInit {
  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);

  recipes: Recipe[] = [];
  currentCategory: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentCategory = params['category'] || null;

      if (this.currentCategory) {
        this.recipeService.getRecipesByCategory(this.currentCategory).subscribe({
          next: (recipes) => (this.recipes = recipes),
          error: (err) => console.error('Failed to load recipes', err),
        });
      } else {
        this.recipeService.getAllRecipes().subscribe({
          next: (recipes) => (this.recipes = recipes),
          error: (err) => console.error('Failed to load recipes', err),
        });
      }
    });
  }
}
