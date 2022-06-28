import { MemberAction } from '$/features/member'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error, success } from '$/utils/toaster'
import { call } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

function* onAcceptInviteAction({
    payload: { roomId, member, delegatedAddress, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.acceptInvite>) {
    try {
        yield call(
            setMultiplePermissions,
            roomId,
            [
                {
                    user: delegatedAddress,
                    permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                },
                {
                    user: member,
                    permissions: [StreamPermission.GRANT, StreamPermission.EDIT],
                },
            ],
            {
                provider,
                requester,
                streamrClient,
            }
        )

        success('Invite accepted.')
    } catch (e) {
        handleError(e)

        error('Failed to accept an invite.')
    }
}

export default function* acceptInvite() {
    yield takeEveryUnique(MemberAction.acceptInvite, onAcceptInviteAction)
}