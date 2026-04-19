import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Comment } from '../../../models';
import { AuthService } from '../../../core/services';
import { TimeAgo } from '../../../shared/pipes';

@Component({
  selector: 'app-comment-item',
  imports: [TimeAgo],
  templateUrl: './comment-item.html',
  styleUrl: './comment-item.css',
})
export class CommentItem {
  @Input() comment!: Comment;
  @Input() recipeId!: string;
  @Output() deleted = new EventEmitter<string>();

  private authService = inject(AuthService);

  get isOwner(): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    return typeof this.comment.userId === 'object'
      ? this.comment.userId._id === currentUserId
      : this.comment.userId === currentUserId;
  }

  get username(): string {
    return typeof this.comment.userId === 'object' ? this.comment.userId.username : 'Unknown';
  }

  deleteComment() {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.deleted.emit(this.comment._id);
    }
  }
}
