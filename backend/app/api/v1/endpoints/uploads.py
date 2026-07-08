from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.upload import UploadMetadataResponse, UploadProgressResponse, UploadValidationResponse
from app.services.file_upload_service import file_upload_service

router = APIRouter(prefix="/uploads")


@router.post("", response_model=UploadMetadataResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    title: str | None = Form(default=None),
    category: str | None = Form(default=None),
    folder_id: str | None = Form(default=None),
    tags: str | None = Form(default=None),
    metadata_json: str | None = Form(default=None),
    current_user: User = Depends(get_current_user),
) -> UploadMetadataResponse:
    return await file_upload_service.upload_metadata_only(
        current_user=current_user,
        file=file,
        title=title,
        category=category,
        folder_id=folder_id,
        tags=tags,
        metadata_json=metadata_json,
    )


@router.post("/validate", response_model=UploadValidationResponse)
async def validate_file_upload(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> UploadValidationResponse:
    return await file_upload_service.validate_upload_file(file=file)


@router.get("/{upload_id}/progress", response_model=UploadProgressResponse)
async def get_upload_progress(
    upload_id: str,
    current_user: User = Depends(get_current_user),
) -> UploadProgressResponse:
    return file_upload_service.get_progress(upload_id)
