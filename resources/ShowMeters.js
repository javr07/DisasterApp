{
	meters.map((meter) => {
		return (
			<Marker
				key={meter.title}
				coordinate={meter.coordinate}
				title={meter.title}
				description={meter.description}
				anchor={{ x: 0.5, y: 0.5 }}
			>
				<MeterSVG color={meter.color} />
			</Marker>
		);
	});
}
