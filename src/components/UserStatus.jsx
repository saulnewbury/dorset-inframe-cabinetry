import { useContext, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { SessionContext } from '@/context'

import SvgIcon from '@/components/SvgIcon'
import LoginDialog from '@/components/LoginDialog'

export default function UserStatus({ showLogin = false }) {
	const [session, setSession] = useContext(SessionContext)
	const [showLoginModal, setShowLogin] = useState(false)
	const [showUserPopup, setShowUserPopup] = useState(false)

	useEffect(() => {
		if (showLogin) setShowLogin(true)
	}, [showLogin])

	return (
		<div>
			{session ? (
				<div className='relative'>
					<button
						onClick={() => setShowUserPopup(!showUserPopup)}
						title='Logged in'
					>
						<SvgIcon shape='user' />
					</button>
					<div
						className={twMerge(
							'absolute top-full bg-white text-nowrap border border-darkGrey px-2 shadow-md flex-col gap-y-2',
							showUserPopup ? 'flex' : 'hidden'
						)}
					>
						<button
							onClick={() => {
								setShowUserPopup(false)
								doLogout()
							}}
						>
							Log out
						</button>
					</div>
				</div>
			) : (
				<button
					type='button'
					className='inline-block whitespace-nowrap cursor-pointer'
					onClick={() => setShowLogin(!showLogin)}
				>
					<span>Login&nbsp;</span>
					<SvgIcon shape='login' />
				</button>
			)}

			{showLoginModal && (
				<LoginDialog
					onClose={() => {
						setShowLogin(false)
					}}
				/>
			)}
		</div>
	)

	async function doLogout() {
		try {
			const res = await fetch('/api/user/logout', {
				method: 'POST',
				body: JSON.stringify({ sessionId: session.sessionId }),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			if (!res.ok) throw new Error('Network error')
			const data = await res.json()
			if (data.error) throw new Error(data.error)
		} catch (err) {
			console.error(err)
		} finally {
			sessionStorage.removeItem('dc-session')
			setSession(null)
		}
	}
}
