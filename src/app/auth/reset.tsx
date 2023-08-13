import { getPublicKey, nip19 } from 'nostr-tools';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';
import { useSecureStorage } from '@utils/hooks/useSecureStorage';

type FormValues = {
  password: string;
  privkey: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.password ? values : {},
    errors: !values.password
      ? {
          password: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

export function ResetScreen() {
  const navigate = useNavigate();
  const setPrivkey = useStronghold((state) => state.setPrivkey);

  const [passwordInput, setPasswordInput] = useState('password');
  const [loading, setLoading] = useState(false);

  const { account } = useAccount();
  const { save, reset } = useSecureStorage();

  // toggle private key
  const showPassword = () => {
    if (passwordInput === 'password') {
      setPasswordInput('text');
    } else {
      setPasswordInput('password');
    }
  };

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: { [x: string]: string }) => {
    setLoading(true);
    if (data.password.length > 3) {
      try {
        let privkey = data.privkey;
        if (privkey.startsWith('nsec')) {
          privkey = nip19.decode(privkey).data as string;
        }

        const tmpPubkey = getPublicKey(privkey);

        if (tmpPubkey !== account.pubkey) {
          setLoading(false);
          setError('password', {
            type: 'custom',
            message:
              "Private key don't match current account store in database, please check again",
          });
        } else {
          // remove old stronghold
          await reset();
          // save privkey to secure storage
          await save(account.pubkey, account.privkey, data.password);
          // add privkey to state
          setPrivkey(account.privkey);
          // redirect to home
          navigate('/auth/unlock', { replace: true });
        }
      } catch {
        setLoading(false);
        setError('password', {
          type: 'custom',
          message: 'Invalid private key',
        });
      }
    } else {
      setLoading(false);
      setError('password', {
        type: 'custom',
        message: 'Password is required and must be greater than 3',
      });
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Reset unlock password</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="privkey" className="font-medium text-white/50">
              Private key
            </label>
            <div className="relative">
              <input
                {...register('privkey', { required: true })}
                type="text"
                placeholder="nsec..."
                className="relative h-12 w-full rounded-lg bg-white/10 px-3.5 py-1 text-white !outline-none placeholder:text-white/10"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-white/50">
              Set a new password to protect your key
            </label>
            <div className="relative">
              <input
                {...register('password', { required: true })}
                type={passwordInput}
                placeholder="min. 4 characters"
                className="relative h-12 w-full rounded-lg bg-white/10 px-3.5 py-1 text-white !outline-none placeholder:text-white/10"
              />
              <button
                type="button"
                onClick={() => showPassword()}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-white/10"
              >
                {passwordInput === 'password' ? (
                  <EyeOffIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
                ) : (
                  <EyeOnIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
                )}
              </button>
            </div>
            <span className="text-sm text-red-400">
              {errors.password && <p>{errors.password.message}</p>}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-fuchsia-500 font-medium text-white hover:bg-fuchsia-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <LoaderIcon className="h-4 w-4 animate-spin text-white" />
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
