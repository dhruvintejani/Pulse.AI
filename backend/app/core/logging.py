import logging
import sys
from pathlib import Path
from loguru import logger
from app.core.config import settings


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        try:
            level: str | int = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


def _category_filter(category: str):
    return lambda record: record["extra"].get("category") == category


def _minimum_level_filter(level_no: int):
    return lambda record: record["level"].no >= level_no


def configure_logging() -> None:
    logger.remove()
    log_dir = Path(settings.LOG_DIR)
    log_dir.mkdir(parents=True, exist_ok=True)

    common_options = {
        "rotation": settings.LOG_ROTATION,
        "retention": settings.LOG_RETENTION,
        "compression": settings.LOG_COMPRESSION,
        "enqueue": True,
        "backtrace": settings.DEBUG,
        "diagnose": settings.DEBUG,
        "serialize": settings.LOG_JSON,
    }

    logger.add(
        sys.stdout,
        level=settings.LOG_LEVEL.upper(),
        serialize=settings.LOG_JSON,
        enqueue=True,
        backtrace=settings.DEBUG,
        diagnose=settings.DEBUG,
    )

    logger.add(log_dir / "app.log", level=settings.LOG_LEVEL.upper(), **common_options)
    logger.add(log_dir / "errors.log", level="ERROR", **common_options)
    logger.add(log_dir / "warnings.log", level="WARNING", filter=_minimum_level_filter(logging.WARNING), **common_options)
    logger.add(log_dir / "requests.log", level="INFO", filter=_category_filter("request"), **common_options)
    logger.add(log_dir / "auth.log", level="INFO", filter=_category_filter("auth"), **common_options)
    logger.add(log_dir / "performance.log", level="INFO", filter=_category_filter("performance"), **common_options)

    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)

    for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
        logging.getLogger(logger_name).handlers = [InterceptHandler()]
        logging.getLogger(logger_name).propagate = False
