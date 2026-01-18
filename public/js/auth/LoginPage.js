import { icons } from '../utils/icons.js'

export function renderLoginPage(container, onLogin, onSwitchToSignup) {
    let email = ''
    let password = ''
    let showPassword = false

    const render = () => {
        container.innerHTML = `
            <div class="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <div class="w-full max-w-md fade-in">
                    
                    <!-- LOGO HEADER -->
                    <div class="text-center mb-8">
                        <img
                            src="/logo.svg"
                            alt="Unify"
                            class="mx-auto h-12 mb-3"
                        />
                        <p class="text-text-secondary text-sm">
                            Welcome back! Sign in to continue
                        </p>
                    </div>

                    <div class="bg-bg-secondary rounded-2xl p-8 border border-border shadow-lg">
                        <form id="login-form" class="space-y-5" novalidate>

                            <!-- ROLL NO -->
                            <div>
                                <label class="block text-sm font-semibold text-text-primary mb-2">
                                    Roll No
                                </label>
                                <div class="relative">
                                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                        ${icons.Mail()}
                                    </div>
                                    <input
                                        id="email-input"
                                        type="text"
                                        value="${email}"
                                        placeholder="250010019143"
                                        class="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm
                                               text-text-primary placeholder-text-muted
                                               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                            </div>

                            <!-- PASSWORD -->
                            <div>
                                <label class="block text-sm font-semibold text-text-primary mb-2">
                                    Password
                                </label>
                                <div class="relative">
                                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                        ${icons.Lock()}
                                    </div>
                                    <input
                                        id="password-input"
                                        type="${showPassword ? 'text' : 'password'}"
                                        value="${password}"
                                        placeholder="Enter your password"
                                        class="w-full pl-10 pr-12 py-3 bg-surface border border-border rounded-xl text-sm
                                               text-text-primary placeholder-text-muted
                                               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                    <button
                                        type="button"
                                        id="toggle-password-btn"
                                        class="absolute right-3 top-1/2 -translate-y-1/2
                                               text-text-muted hover:text-primary text-sm font-medium"
                                    >
                                        ${showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <!-- SUBMIT -->
                            <button
                                type="submit"
                                class="w-full py-3 bg-primary text-white rounded-xl font-semibold
                                       hover:bg-primary-hover transition-colors
                                       flex items-center justify-center gap-2"
                            >
                                Sign In
                                ${icons.ArrowRight()}
                            </button>
                        </form>

                        <!-- SWITCH -->
                        <div class="mt-6 text-center">
                            <p class="text-sm text-text-secondary">
                                Don't have an account?
                                <button
                                    id="switch-to-signup-btn"
                                    class="text-primary font-semibold hover:underline"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `

        const form = container.querySelector('#login-form')
        const emailInput = container.querySelector('#email-input')
        const passwordInput = container.querySelector('#password-input')
        const togglePasswordBtn = container.querySelector('#toggle-password-btn')
        const switchToSignupBtn = container.querySelector('#switch-to-signup-btn')

        emailInput?.addEventListener('input', e => {
            email = e.target.value
        })

        passwordInput?.addEventListener('input', e => {
            password = e.target.value
        })

        togglePasswordBtn?.addEventListener('click', () => {
            showPassword = !showPassword
            render()
        })

        form?.addEventListener('submit', e => {
            e.preventDefault()
            onLogin(email || '', password || '')
        })

        switchToSignupBtn?.addEventListener('click', onSwitchToSignup)
    }

    render()
}
