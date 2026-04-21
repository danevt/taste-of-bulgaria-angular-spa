import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../core/services';
import { Recipe } from '../../models';
import { ImageFallback } from '../../core/utils/index';
import { SliceTitle, TimeAgo } from '../../shared/pipes';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TimeAgo, SliceTitle],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private recipeService = inject(RecipeService);

  readonly ImageFallback = ImageFallback;

  latestRecipes: Recipe[] = [];

  ngOnInit() {
    this.recipeService.getLatestRecipes().subscribe({
      next: (recipes) => (this.latestRecipes = recipes),
      error: (err) => console.error('Failed to load latest recipes', err),
    });
  }
}
