# Verification Log

## Critical Workflow Verified

1. ✅ Backend starts on port 3001
2. ✅ Frontend opens on port 5173
3. ✅ Reviewer can log in
4. ✅ Candidate review queue loads
5. ✅ Reviewer can add a review item
6. ✅ Reviewer can mark an item complete
7. ✅ Session stays active (token expiry fixed to 2h)
8. ✅ Data persists in-memory during session (resets on backend restart)
