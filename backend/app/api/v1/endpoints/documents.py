from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from app.dependencies import get_current_user, get_pagination_params
from app.models.document import DocumentKind
from app.models.user import User
from app.schemas.common import Page, PaginationParams, SuccessResponse
from app.schemas.document import (
    DocumentDetailResponse,
    DocumentFacetResponse,
    DocumentMove,
    DocumentPreviewResponse,
    DocumentRename,
    DocumentResponse,
    DocumentUpdate,
    DocumentUploadResult,
)
from app.services import document_service

router = APIRouter(prefix="/documents")


@router.get("", response_model=Page[DocumentResponse])
async def list_documents(
    category: str | None = Query(default=None, max_length=80),
    kind: DocumentKind | None = Query(default=None),
    folder_id: str | None = Query(default=None),
    tags: list[str] | None = Query(default=None),
    params: PaginationParams = Depends(get_pagination_params),
    current_user: User = Depends(get_current_user),
) -> Page[DocumentResponse]:
    return await document_service.list_documents(
        current_user=current_user,
        params=params,
        category=category,
        kind=kind,
        folder_id=folder_id,
        tags=tags,
    )


@router.post("/upload", response_model=DocumentUploadResult, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    title: str | None = Form(default=None),
    description: str | None = Form(default=None),
    category: str | None = Form(default=None),
    folder_id: str | None = Form(default=None),
    tags: str | None = Form(default=None),
    metadata_json: str | None = Form(default=None),
    extracted_text: str | None = Form(default=None),
    current_user: User = Depends(get_current_user),
) -> DocumentUploadResult:
    return await document_service.upload_document(
        current_user=current_user,
        file=file,
        title=title,
        description=description,
        category=category,
        folder_id=folder_id,
        tags=tags,
        metadata_json=metadata_json,
        extracted_text=extracted_text,
    )


@router.get("/recent", response_model=list[DocumentResponse])
async def recent_documents(
    limit: int = Query(default=8, ge=1, le=30),
    current_user: User = Depends(get_current_user),
) -> list[DocumentResponse]:
    return await document_service.recent_documents(current_user=current_user, limit=limit)


@router.get("/categories", response_model=list[DocumentFacetResponse])
async def list_document_categories(current_user: User = Depends(get_current_user)) -> list[DocumentFacetResponse]:
    return await document_service.list_categories(current_user=current_user)


@router.get("/tags", response_model=list[DocumentFacetResponse])
async def list_document_tags(current_user: User = Depends(get_current_user)) -> list[DocumentFacetResponse]:
    return await document_service.list_tags(current_user=current_user)


@router.get("/{document_id}", response_model=DocumentDetailResponse)
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
) -> DocumentDetailResponse:
    return await document_service.get_document(current_user=current_user, document_id=document_id)


@router.get("/{document_id}/preview", response_model=DocumentPreviewResponse)
async def preview_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
) -> DocumentPreviewResponse:
    return await document_service.preview_document(current_user=current_user, document_id=document_id)


@router.patch("/{document_id}", response_model=DocumentDetailResponse)
async def update_document(
    document_id: str,
    request: DocumentUpdate,
    current_user: User = Depends(get_current_user),
) -> DocumentDetailResponse:
    return await document_service.update_document(current_user=current_user, document_id=document_id, request=request)


@router.patch("/{document_id}/rename", response_model=DocumentDetailResponse)
async def rename_document(
    document_id: str,
    request: DocumentRename,
    current_user: User = Depends(get_current_user),
) -> DocumentDetailResponse:
    return await document_service.rename_document(current_user=current_user, document_id=document_id, request=request)


@router.patch("/{document_id}/move", response_model=DocumentDetailResponse)
async def move_document(
    document_id: str,
    request: DocumentMove,
    current_user: User = Depends(get_current_user),
) -> DocumentDetailResponse:
    return await document_service.move_document(current_user=current_user, document_id=document_id, request=request)


@router.delete("/{document_id}", response_model=SuccessResponse)
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
) -> SuccessResponse:
    await document_service.delete_document(current_user=current_user, document_id=document_id)
    return SuccessResponse(message="Document deleted")
