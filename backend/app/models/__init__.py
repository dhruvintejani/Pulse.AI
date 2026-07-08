from app.models.chat import Chat
from app.models.document import Document
from app.models.feedback import Feedback
from app.models.folder import Folder
from app.models.message import Message
from app.models.notification import Notification
from app.models.settings import UserSettings
from app.models.user import User

DOCUMENT_MODELS = [
    User,
    Folder,
    Chat,
    Message,
    Document,
    Notification,
    UserSettings,
    Feedback,
]

__all__ = [
    "Chat",
    "Document",
    "Feedback",
    "Folder",
    "Message",
    "Notification",
    "User",
    "UserSettings",
    "DOCUMENT_MODELS",
]
