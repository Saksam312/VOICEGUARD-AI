from fastapi import APIRouter
from .auth import router as auth_router
from .calls import router as calls_router
from .analysis import router as analysis_router
from .speaker import router as speaker_router
from .models_eval import router as models_eval_router
from .labs import router as labs_router
from .security_audit import router as security_audit_router
from .privacy_api import router as privacy_router
from .websocket import router as ws_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(calls_router, prefix="/call", tags=["Call Management"])
api_router.include_router(analysis_router, tags=["Audio Analysis"])
api_router.include_router(speaker_router, prefix="/speaker", tags=["Speaker Verification"])
api_router.include_router(models_eval_router, tags=["Models & Evaluation"])
api_router.include_router(labs_router, tags=["Attack & Robustness Labs"])
api_router.include_router(security_audit_router, tags=["Security & Blockchain Audit"])
api_router.include_router(privacy_router, prefix="/privacy", tags=["Privacy Controls"])
