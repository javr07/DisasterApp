{
	transformers.map((transformer) => {
		return (
			<Marker
				key={transformer.title}
				coordinate={transformer.coordinate}
				title={transformer.title}
				description={transformer.description}
				anchor={{ x: 0.5, y: 0.5 }}
			>
				<TransformerSVG color={transformer.color} />
			</Marker>
		);
	});
}
