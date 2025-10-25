"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { projectSchema } from "@/lib/zod/schemas/project";
import { FormInput, FormTextarea } from "../form/form";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

export default function ExampleFrom() {
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      users: [{ email: "" }],
      status: "draft" as const,
    },
  });

  const {
    fields: users,
    append: addUser,
    remove: removeUser,
  } = useFieldArray({
    control: form.control,
    name: "users",
  });

  async function onSubmit(data: z.infer<typeof projectSchema>) {}

  return (
    <div className="container px-4 mx-auto my-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput control={form.control} name="name" label="Name" />

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            description="Be as detailed as possible"
          />

          <FieldSet>
            <div className="flex justify-between gap-2 items-center">
              <FieldContent>
                <FieldLegend variant="label" className="mb-0">
                  User Email Addresses
                </FieldLegend>
                <FieldDescription>
                  Add up to 5 users to this project (including yourself).
                </FieldDescription>
                {form.formState.errors.users?.root && (
                  <FieldError errors={[form.formState.errors.users.root]} />
                )}
              </FieldContent>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addUser({ email: "" })}
              >
                Add User
              </Button>
            </div>
            <FieldGroup>
              {users.map((user, index) => (
                <Controller
                  key={user.id}
                  name={`users.${index}.email`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id={`${field.name}-${index}`}
                            aria-invalid={fieldState.invalid}
                            aria-label={`User ${index + 1} email`}
                            type="email"
                          />
                          {users.length > 1 && (
                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => removeUser(index)}
                                aria-label={`Remove User ${index + 1}`}
                              >
                                <XIcon />
                              </InputGroupButton>
                            </InputGroupAddon>
                          )}
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
              ))}
            </FieldGroup>
          </FieldSet>
          <Button type="submit">Create</Button>
        </FieldGroup>
      </form>
    </div>
  );
}
