import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useMemo, useState } from 'react';
import { z } from 'zod';

import { Button } from '../elements/button';
import { ClientOnly } from '@/components/client-only';
import ShootingStars from '@/components/decorations/shooting-star';
import StarBackground from '@/components/decorations/star-background';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { cn } from '@/lib/utils';

/**
 * Strapi input shape. Each form.inputs entry comes from the
 * `dynamic-zone.form-next-to-section` component's `form` field.
 */
interface StrapiFormInput {
  name: string;
  type: string; // 'text' | 'email' | 'textarea' | 'submit' | ...
  placeholder?: string;
}

/**
 * Normalize a Strapi input name (e.g. "Your email") into a valid object key
 * usable as a TanStack Form field name. Keeps the original as a display label.
 */
function normalizeKey(name: string): string {
  return (
    name
      .toLowerCase()
      .replaceAll(/\s+/g, '_')
      .replaceAll(/[^a-z0-9_]/g, '') || 'field'
  );
}

/**
 * Builds a Zod schema + default values from the dynamic Strapi form.inputs
 * list at render time. Used as the TanStack Form `validators.onChange` and
 * `defaultValues`.
 */
function buildFormSchema(inputs: Array<StrapiFormInput>) {
  const fieldInputs = inputs.filter((i) => i.type !== 'submit');

  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, string> = {};

  for (const input of fieldInputs) {
    const key = normalizeKey(input.name);
    defaultValues[key] = '';
    if (input.type === 'email') {
      schemaShape[key] = z.email('Please enter a valid email address');
    } else {
      schemaShape[key] = z.string().min(1, `${input.name} is required`);
    }
  }

  return {
    schema: z.object(schemaShape),
    defaultValues,
    fieldInputs,
  };
}

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  section,
}: {
  heading: string;
  sub_heading: string;
  form: any;
  section: any;
  social_media_icon_links?: any;
}) {
  const socials = [
    {
      title: 'twitter',
      href: 'https://twitter.com/strapijs',
      icon: (
        <IconBrandX className="h-5 w-5 text-muted  hover:text-neutral-100" />
      ),
    },
    {
      title: 'github',
      href: 'https://github.com/strapi',
      icon: (
        <IconBrandGithub className="h-5 w-5 text-muted  hover:text-neutral-100" />
      ),
    },
    {
      title: 'linkedin',
      href: 'https://linkedin.com/strapi',
      icon: (
        <IconBrandLinkedin className="h-5 w-5 text-muted  hover:text-neutral-100" />
      ),
    },
  ];

  const inputs: Array<StrapiFormInput> = form?.inputs ?? [];
  const submitInput = inputs.find((i) => i.type === 'submit');

  // Memoize the schema + defaults so the form instance isn't torn down on
  // every render. Depends on the JSON shape of `inputs` from Strapi.
  const { schema, defaultValues, fieldInputs } = useMemo(
    () => buildFormSchema(inputs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(inputs)]
  );

  const [submitted, setSubmitted] = useState(false);

  const contactForm = useForm({
    defaultValues,
    // Cast: the schema shape is built dynamically from Strapi's form.inputs
    // at render time, so TypeScript can't verify its field names match
    // `defaultValues` statically. Runtime validation is correct; this is
    // just a compile-time limitation of dynamic schemas + TanStack Form's
    // standard-schema type inference.

    validators: { onChange: schema as any },
    onSubmit: async ({ value }) => {
      console.log('Contact form placeholder — not wired to a backend', value);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSubmitted(true);
    },
  });

  const { Field, handleSubmit, state, reset } = contactForm;

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
      <div className="flex relative z-20 items-center w-full justify-center px-4 py-4 lg:py-40 sm:px-6 lg:flex-none lg:px-20  xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h1 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-white">
              {heading}
            </h1>
            <p className="mt-4 text-muted   text-sm max-w-sm">{sub_heading}</p>
          </div>

          <div className="py-10">
            {submitted ? (
              <div className="rounded-md border border-neutral-800 bg-neutral-900 p-6 text-center">
                <p className="text-sm text-neutral-200">
                  Thanks — your message has been captured.
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  This form is a placeholder and isn't wired to a backend yet.
                  The submitted values are in the browser console.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setSubmitted(false);
                  }}
                  className="mt-4 text-xs text-neutral-400 underline hover:text-neutral-200"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void handleSubmit();
                }}
                className="space-y-4"
              >
                {fieldInputs.map((input) => {
                  const key = normalizeKey(input.name);
                  return (
                    <Field key={key} name={key}>
                      {(field) => (
                        <div>
                          <label
                            htmlFor={field.name}
                            className="block text-sm font-medium leading-6 text-neutral-400"
                          >
                            {input.name}
                          </label>
                          <div className="mt-2">
                            {input.type === 'textarea' ? (
                              <textarea
                                id={field.name}
                                name={field.name}
                                rows={5}
                                placeholder={input.placeholder}
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                disabled={state.isSubmitting}
                                className={cn(
                                  'block w-full bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-neutral-100 placeholder:text-gray-400 focus:ring-2 focus:outline-none sm:text-sm sm:leading-6 disabled:opacity-50',
                                  field.state.meta.errors.length > 0
                                    ? 'ring-2 ring-red-500/60 focus:ring-red-500/60'
                                    : 'focus:ring-neutral-400'
                                )}
                              />
                            ) : (
                              <input
                                id={field.name}
                                name={field.name}
                                type={input.type}
                                placeholder={input.placeholder}
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                disabled={state.isSubmitting}
                                className={cn(
                                  'block w-full bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-neutral-100 placeholder:text-gray-400 focus:ring-2 focus:outline-none sm:text-sm sm:leading-6 disabled:opacity-50',
                                  field.state.meta.errors.length > 0
                                    ? 'ring-2 ring-red-500/60 focus:ring-red-500/60'
                                    : 'focus:ring-neutral-400'
                                )}
                              />
                            )}
                          </div>
                          {field.state.meta.errors.length > 0 && (
                            <p className="mt-1 text-xs text-red-400">
                              {typeof field.state.meta.errors[0] === 'string'
                                ? field.state.meta.errors[0]
                                : ((
                                    field.state.meta.errors[0] as
                                      | { message?: string }
                                      | undefined
                                  )?.message ?? 'Invalid value')}
                            </p>
                          )}
                        </div>
                      )}
                    </Field>
                  );
                })}

                {submitInput && (
                  <Button
                    className="w-full mt-6"
                    type="submit"
                    disabled={state.isSubmitting || !state.canSubmit}
                  >
                    {state.isSubmitting ? 'Sending…' : submitInput.name}
                  </Button>
                )}
              </form>
            )}
          </div>
          <div className="flex items-center justify-center space-x-4 py-4">
            {socials.map((social) => (
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                key={social.title}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full z-20 hidden md:flex border-l border-charcoal overflow-hidden bg-neutral-900 items-center justify-center">
        <ClientOnly>
          <StarBackground />
          <ShootingStars />
        </ClientOnly>
        <div className="max-w-sm mx-auto">
          {section?.users && (
            <div className="flex flex-row items-center justify-center mb-10 w-full">
              <AnimatedTooltip items={section.users} />
            </div>
          )}
          <p className="font-semibold text-xl text-center  text-muted text-balance">
            {section?.heading}
          </p>
          <p className="font-normal text-base text-center text-neutral-500  mt-8 text-balance">
            {section?.sub_heading}
          </p>
        </div>
      </div>
    </div>
  );
}
