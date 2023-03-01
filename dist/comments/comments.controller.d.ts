import { CommentsService } from "./comments.service";
import { AddCommentDto } from "./dto/AddComment.dto";
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    add(req: any, dto: AddCommentDto): Promise<any>;
}
