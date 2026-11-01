package com.example.savify_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * @EnableAsync activates Spring's asynchronous method execution infrastructure.
 *
 * Without this annotation, any method annotated with @Async (like
 * EmailService.sendAlertEmails) will still compile and run, but it will execute
 * SYNCHRONOUSLY on the caller's thread — completely defeating the purpose.
 * Spring silently ignores @Async unless this switch is turned on.
 *
 * Spring creates a SimpleAsyncTaskExecutor thread pool by default.
 * For production you would configure a custom ThreadPoolTaskExecutor bean
 * with bounded queue size and rejection policy, but the default is fine for now.
 */
@SpringBootApplication
@EnableAsync
public class SavifyBackendApplication {

	public static void main(String[] args) {
        SpringApplication.run(SavifyBackendApplication.class, args);
	}

}
