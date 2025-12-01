"use client";

import { useEnvironment } from "@/hooks/useEnvironment";
import styles from "./page.module.css";
import { PageError } from "@/components/page-error/page-error";
import { PageLoading } from "@/components/page-loading/page-loading";
import { CardContent } from "@/components/card-content/card-content";
import { HeaderContent } from "@/components/header-content/header-content";
import {
  schemaApiRequestThoughtSpotTokenPost,
  type SchemaApiRequestThoughtSpotTokenPost,
} from "./api/thoughtspot/token/schema";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, SegmentedControl } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const PageHome = () => {
  const { env, error, isLoading } = useEnvironment();
  const { getToken } = useAuth();
  const defaultValues: SchemaApiRequestThoughtSpotTokenPost = useMemo(() => {
    if (env && env.useEnvironmentVars)
      return {
        useEnvVars: true,
        username: "",
        validityTimeInSeconds: 300,
      } as SchemaApiRequestThoughtSpotTokenPost;
    return {
      useEnvVars: false,
      host: "",
      username: "",
      authType: "password",
      validityTimeInSeconds: 300,
      password: "",
    } as SchemaApiRequestThoughtSpotTokenPost;
  }, [env]);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SchemaApiRequestThoughtSpotTokenPost>({
    resolver: zodResolver(schemaApiRequestThoughtSpotTokenPost),
    defaultValues,
  });
  const watchedAuthType = useWatch({
    control,
    name: "authType",
    defaultValue: "password",
  });
  const router = useRouter();

  useEffect(() => {
    if (env) {
      if (env.useEnvironmentVars) {
        setValue("useEnvVars", true);
        setValue("host", env.host);
      } else {
        setValue("useEnvVars", false);
      }
    }
  }, [env, setValue]);

  const onSubmit = handleSubmit(
    async (formData) => {
      if (formData.useEnvVars) {
        void (await getToken({
          useEnvVars: true,
          username: formData.username,
          validityTimeInSeconds: formData.validityTimeInSeconds,
        }));
      } else {
        if (formData.authType === "password") {
          void (await getToken({
            useEnvVars: false,
            authType: formData.authType,
            host: formData.host,
            username: formData.username,
            password: formData.password,
            validityTimeInSeconds: formData.validityTimeInSeconds,
          }));
        } else {
          void (await getToken({
            useEnvVars: false,
            authType: formData.authType,
            host: formData.host,
            username: formData.username,
            secretKey: formData.secretKey,
            validityTimeInSeconds: formData.validityTimeInSeconds,
          }));
        }
      }
      router.push("/configure");
    },
    (error) => console.log(error)
  );

  if (error)
    return (
      <PageError>An error occurred while trying to load environment</PageError>
    );

  if (isLoading) return <PageLoading>Loading environment</PageLoading>;

  if (!env)
    throw new Error("env is neither loading nor an error but is undefined");

  return (
    <div className={styles.root}>
      <CardContent>
        <HeaderContent
          title="LiveSpot"
          description="Full-screen display for your ThoughtSpot liveboards"
        />
        <form className={styles.form} onSubmit={onSubmit}>
          {!env.useEnvironmentVars && (
            <Input.Wrapper
              label="ThoughtSpot host"
              error={"host" in errors && errors.host?.message}
            >
              <Input
                placeholder="https://my-cluster.thoughtspot.cloud"
                {...register("host")}
              />
            </Input.Wrapper>
          )}
          <Input.Wrapper label="Username" error={errors.username?.message}>
            <Input
              placeholder="someone@somewhere.com"
              {...register("username")}
            />
          </Input.Wrapper>
          {!env.useEnvironmentVars && (
            <Controller
              control={control}
              name="authType"
              render={({ field: { value, onChange } }) => (
                <SegmentedControl
                  data={[
                    { value: "password", label: "Use password" },
                    { value: "secretKey", label: "Use secret key" },
                  ]}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          )}
          {!env.useEnvironmentVars && watchedAuthType === "password" && (
            <Input.Wrapper
              label="Password"
              error={"password" in errors && errors.password?.message}
            >
              <Input type="password" {...register("password")} />
            </Input.Wrapper>
          )}
          {!env.useEnvironmentVars && watchedAuthType === "secretKey" && (
            <Input.Wrapper
              label="Secret key"
              error={"secretKey" in errors && errors.secretKey?.message}
            >
              <Input type="password" {...register("secretKey")} />
            </Input.Wrapper>
          )}
          <Input.Wrapper
            label="Validity time in seconds"
            description="Length of time, in seconds, that this login session will be valid"
            error={errors.validityTimeInSeconds?.message}
          >
            <Input
              placeholder="Minimum 60 (1 minute), maximum 86,400 (1 day)"
              {...register("validityTimeInSeconds")}
            />
          </Input.Wrapper>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <Button variant="filled" type="submit" loading={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
};

export default PageHome;
