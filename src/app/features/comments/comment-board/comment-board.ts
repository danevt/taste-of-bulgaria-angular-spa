import { Component, Input, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommentService, AuthService } from '../../../core/services';
import { Comment } from '../../../models';
import { CommentItem } from '../comment-item/comment-item';

@Component({
  selector: 'app-comment-board',
  imports: [FormsModule, CommentItem],
  templateUrl: './comment-board.html',
  styleUrl: './comment-board.css',
})
export class CommentBoard implements OnInit {
  @Input() recipeId!: string;
  @Input() comments: Comment[] = [];

  private commentService = inject(CommentService);
  private authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
  newCommentText = '';

  ngOnInit() {
    // Comments are passed from parent (RecipeContent)
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.newCommentText.trim()) return;

    this.commentService.createComment(this.recipeId, this.newCommentText).subscribe({
      next: (newComment) => {
        this.comments = [...this.comments, newComment];
        this.newCommentText = '';
        form.reset();
      },
      error: (err) => console.error('Failed to add comment', err),
    });
  }

  onCommentDeleted(commentId: string) {
    this.commentService.deleteComment(this.recipeId, commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter((c) => c._id !== commentId);
      },
      error: (err) => console.error('Failed to delete comment', err),
    });
  }
}
