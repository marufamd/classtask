package com.classtask.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.classtask.server.util.Logger;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.classtask.server.repository")
@EntityScan(basePackages = "com.classtask.server.entity")
public class ClasstaskServerApplication {

	public static void main(String[] args) {
		ApplicationContext ctx = SpringApplication.run(ClasstaskServerApplication.class, args);
		Logger logger = ctx.getBean(Logger.class);
		Environment env = ctx.getEnvironment();
		String port = env.getProperty("server.port", "8080");
		logger.log("Web server running on port " + port + ".");
	}

}
