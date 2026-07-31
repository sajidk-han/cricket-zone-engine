-- ====================================================================
-- MIGRATION 004: Enterprise RLS Policies
-- Security policies for Preferences, Invites, Notifications, and Audit Logs
-- ====================================================================

-- 1. User Preferences (Only the user can view/update their own preferences)
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences FOR SELECT
USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_preferences.user_id));

CREATE POLICY "Users can insert their own preferences"
ON public.user_preferences FOR INSERT
WITH CHECK (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_preferences.user_id));

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences FOR UPDATE
USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_preferences.user_id));

-- 2. Organization Invitations
-- Viewable by Org Admins OR by the invitee (via email)
CREATE POLICY "Org Admins can view invitations"
ON public.organization_invitations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    JOIN public.users u ON u.id = om.user_id
    WHERE om.org_id = organization_invitations.org_id
    AND u.auth_id = auth.uid()
    AND om.role = 'admin'
  )
);

CREATE POLICY "Org Admins can manage invitations"
ON public.organization_invitations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    JOIN public.users u ON u.id = om.user_id
    WHERE om.org_id = organization_invitations.org_id
    AND u.auth_id = auth.uid()
    AND om.role = 'admin'
  )
);

-- 3. Notifications (Users can only see their own notifications)
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = notifications.user_id));

CREATE POLICY "Users can update (mark as read) their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = notifications.user_id));

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = notifications.user_id));

-- 4. Audit Logs (Immutable, Org Admins can only view)
CREATE POLICY "Org Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members om
    JOIN public.users u ON u.id = om.user_id
    WHERE om.org_id = audit_logs.org_id
    AND u.auth_id = auth.uid()
    AND om.role = 'admin'
  )
);

-- No INSERT/UPDATE/DELETE policies for audit logs (they are written by backend server roles bypassing RLS, or specific secure functions)

-- Update Schema Version
INSERT INTO public.schema_version (version, description) 
VALUES ('1.1.1', 'Applied Enterprise RLS Policies');
