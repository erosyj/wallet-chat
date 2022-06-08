import { useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { useWalletAccount } from '../../features/wallet/hooks'
import isBlank from '../../utils/isBlank'
import Form from '../Form'
import Hint from '../Hint'
import Label from '../Label'
import Modal, { ModalProps } from './Modal'
import SelectField, { Option as RawOption, SingleValue as RawSingleValue } from '../SelectField'
import Submit from '../Submit'
import Text from '../Text'
import TextField from '../TextField'
import Toggle from '../Toggle'
import PrivateIcon from '../../icons/PrivateIcon'
import PublicIcon from '../../icons/PublicIcon'
import { v4 as uuidv4 } from 'uuid'
import { Prefix, PrivacyOption, PrivacySetting } from '../../../types/common'
import { RoomAction } from '../../features/room'

export const PrivateRoomOption: PrivacyOption = {
    value: PrivacySetting.Private,
    label: 'Private',
    desc: 'Only invited members can post and view messages',
    icon: PrivateIcon,
}

export const PublicRoomOption: PrivacyOption = {
    value: PrivacySetting.Public,
    label: 'Public',
    desc: 'Anyone can view messages',
    icon: PublicIcon,
}

export const privacyOptions: PrivacyOption[] = [PrivateRoomOption, PublicRoomOption]

export default function AddRoomModal({ setOpen, ...props }: ModalProps) {
    const [privacySetting, setPrivacySetting] = useState<PrivacyOption>(PrivateRoomOption)

    const [roomName, setRoomName] = useState<string>('')

    const canSubmit = !isBlank(roomName)

    const dispatch = useDispatch()

    const account = useWalletAccount()

    const [storage, setStorage] = useState<boolean>(false)

    function onStorageToggleClick() {
        setStorage((current) => !current)
    }

    function onClose() {
        setRoomName('')
        setPrivacySetting(PrivateRoomOption)
    }

    function onSubmit() {
        if (!canSubmit) {
            return
        }

        const now = Date.now()

        dispatch(
            RoomAction.create({
                id: `/${Prefix.Room}/${uuidv4()}`,
                createdAt: now,
                updatedAt: now,
                createdBy: account!,
                owner: account!,
                name: roomName,
                privacy: privacySetting.value,
                useStorage: storage,
            })
        )

        if (typeof setOpen === 'function') {
            setOpen(false)
            onClose()
        }
    }

    return (
        <Modal {...props} title="Create new room" setOpen={setOpen} onClose={onClose}>
            <Form onSubmit={onSubmit}>
                <>
                    <Label htmlFor="roomName">Name</Label>
                    <TextField
                        placeholder="e.g. giggling-bear"
                        id="roomName"
                        value={roomName}
                        onChange={(e) => void setRoomName(e.target.value)}
                        autoFocus
                    />
                    <Hint>The room name will be publicly visible.</Hint>
                </>
                <>
                    <Label>Choose privacy</Label>
                    <SelectField
                        options={privacyOptions}
                        value={privacySetting}
                        onChange={(option) => void setPrivacySetting(option as PrivacyOption)}
                        optionComponent={Option}
                        singleValueComponent={SingleValue}
                    />
                </>
                <>
                    <Label>Message storage</Label>
                    <div
                        css={[
                            tw`
                                flex
                            `,
                        ]}
                    >
                        <div
                            css={[
                                tw`
                                    flex-grow
                                `,
                            ]}
                        >
                            <Hint
                                css={[
                                    tw`
                                        pr-16
                                    `,
                                ]}
                            >
                                <Text>
                                    When message storage is disabled, participants will only see
                                    messages sent while they are online.
                                </Text>
                            </Hint>
                        </div>
                        <div
                            css={[
                                tw`
                                    mt-2
                                `,
                            ]}
                        >
                            <Toggle value={storage} onClick={onStorageToggleClick} />
                        </div>
                    </div>
                </>
                <>
                    <Submit label="Create" disabled={!canSubmit} />
                </>
            </Form>
        </Modal>
    )
}

export function SingleValue({ data: { icon: Icon }, children, ...props }: any) {
    return (
        <RawSingleValue {...props}>
            <div
                css={[
                    tw`
                        text-[14px]
                        p-0
                        flex
                        items-center
                    `,
                ]}
            >
                <div
                    css={[
                        tw`
                            text-[#59799C]
                            flex
                            justify-center
                            w-10
                        `,
                    ]}
                >
                    <Icon css={tw`block`} />
                </div>
                <div>
                    <Text>{children}</Text>
                </div>
            </div>
        </RawSingleValue>
    )
}

export function Option({ data: { label, icon: Icon, desc }, ...props }: any) {
    return (
        <RawOption {...props}>
            <div
                css={[
                    tw`
                        flex
                        items-center
                    `,
                ]}
            >
                <div
                    css={[
                        tw`
                            bg-[#F1F4F7]
                            rounded-full
                            w-8
                            h-8
                            flex
                            justify-center
                            items-center
                            mr-3
                        `,
                    ]}
                >
                    <Icon
                        css={[
                            tw`
                                block
                            `,
                        ]}
                    />
                </div>
                <div>
                    <div
                        css={[
                            tw`
                                text-[#36404E]
                                text-[14px]
                                font-medium
                            `,
                        ]}
                    >
                        <Text>{label}</Text>
                    </div>
                    <Hint
                        css={[
                            tw`
                                text-[0.75rem]
                                mt-0
                            `,
                        ]}
                    >
                        <Text>{desc}</Text>
                    </Hint>
                </div>
            </div>
        </RawOption>
    )
}